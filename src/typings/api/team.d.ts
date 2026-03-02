declare namespace Api {
  /**
   * namespace Team
   *
   * backend api module: "team"
   */
  namespace Team {
    interface TeamRecord {
      id: number;
      tenantId: string;
      organizationId: string;
      organizationName: string;
      teamCode: string;
      teamName: string;
      description: string;
      status: Api.Common.EnableStatus;
      sort: number;
      userCount: number;
      createTime: string;
      updateTime: string;
    }

    interface TeamListParams {
      current: number;
      size: number;
      keyword?: string;
      status?: Api.Common.EnableStatus;
      organizationId?: number;
    }

    interface TeamPayload {
      organizationId: number;
      teamCode: string;
      teamName: string;
      description?: string;
      status?: Api.Common.EnableStatus;
      sort?: number;
    }

    interface TeamOption {
      id: number;
      organizationId: string;
      teamCode: string;
      teamName: string;
    }

    type TeamList = Api.Common.PaginatingQueryRecord<TeamRecord>;
  }
}
